using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using DotNetOpenAuth.AspNet;
using DotNetOpenAuth.AspNet.Clients;
using DotNetOpenAuth.Messaging;
using DotNetOpenAuth.OAuth;
using DotNetOpenAuth.OAuth.ChannelElements;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace OAuth1.Models
{
    public sealed class JohnDeereClient
    {
        private readonly string _BaseAddress;
        private readonly HttpContextBase _Context;
        private IConsumerTokenManager _TokenManager;
        private WebConsumer _WebWorker;
        private const string PROVIDER_NAME = "JohnDeere";
        private const string ACCESS_TOKEN_KEY = "urn:optmzr:session:user:access-token";
        private const string API_CATALOG_KEY = "urn:optmzr:integration:john-deere:catalog";
        private const string MEDIA_TYPE_JSON = "application/vnd.deere.axiom.v3+json";

        // TODO (Matt Magurany 2014-10-02): When JD fixes the 403 status code bug, change these URLs to the base address.
        public static readonly ServiceProviderDescription ServiceDescription = new ServiceProviderDescription
        {
            AccessTokenEndpoint = new MessageReceivingEndpoint("https://api.deere.com/platform/oauth/access_token", HttpDeliveryMethods.PostRequest | HttpDeliveryMethods.AuthorizationHeaderRequest),
            ProtocolVersion = ProtocolVersion.V10a,
            RequestTokenEndpoint = new MessageReceivingEndpoint("https://api.deere.com/platform/oauth/request_token", HttpDeliveryMethods.PostRequest | HttpDeliveryMethods.AuthorizationHeaderRequest),
            TamperProtectionElements = new ITamperProtectionChannelBindingElement[]
            {
                new HmacSha1SigningBindingElement()
            },
            UserAuthorizationEndpoint = new MessageReceivingEndpoint("https://my.deere.com/consentToUseOfData", HttpDeliveryMethods.GetRequest)
        };

        public JohnDeereClient(HttpContextBase context, string baseAddress, string consumerKey, string consumerSecret)
        {
            _BaseAddress = baseAddress;
            _Context = context;
            _TokenManager = new SimpleConsumerTokenManager(consumerKey, consumerSecret, new CookieOAuthTokenManager(context));
            _WebWorker = new WebConsumer(ServiceDescription, _TokenManager);
        }

        public string AccessToken
        {
            get
            {
                return _Context.Session[ACCESS_TOKEN_KEY] as string;
            }
            set
            {
                _Context.Session[ACCESS_TOKEN_KEY] = value;
            }
        }

        private static JsonMediaTypeFormatter JsonFormatter
        {
            get
            {
                var converter = new StringEnumConverter()
                {
                    CamelCaseText = true
                };

                var serializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    NullValueHandling = NullValueHandling.Ignore
                };
                serializerSettings.Converters.Add(converter);

                var formatter = new JsonMediaTypeFormatter
                {
                    SerializerSettings = serializerSettings
                };

                return formatter;
            }
        }

        private static MediaTypeWithQualityHeaderValue JsonMediaTypeHeaderValue
        {
            get
            {
                return new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_JSON);
            }
        }

        public string ProviderName
        {
            get
            {
                return PROVIDER_NAME;
            }
        }

        private HttpClient CreateClient()
        {
            string accessToken = AccessToken;
            var innerHandler = new HttpClientHandler();
            HttpMessageHandler handler;

            if (string.IsNullOrWhiteSpace(accessToken))
            {
                var signedMessageHandler = new OAuth1HmacSha1HttpMessageHandler(innerHandler);
                signedMessageHandler.ConsumerKey = _TokenManager.ConsumerKey;
                signedMessageHandler.ConsumerSecret = _TokenManager.ConsumerSecret;

                handler = signedMessageHandler;
            }
            else
            {
                handler = _WebWorker.CreateAuthorizingHandler(accessToken, innerHandler);
            }

            var client = new HttpClient(handler);
            client.BaseAddress = new Uri(_BaseAddress);
            client.DefaultRequestHeaders.Accept.Add(JsonMediaTypeHeaderValue);

            return client;
        }

        private async Task<T> DeserializeAsync<T>(HttpResponseMessage response)
        {
            using (var stream = await response.Content.ReadAsStreamAsync())
            {
                var streamReader = new StreamReader(stream);
                var jsonReader = new JsonTextReader(streamReader);
                var serializer = new JsonSerializer();

                return serializer.Deserialize<T>(jsonReader);
            }
        }

        private async Task<JohnDeereCatalog> GetCatalog(HttpClient client)
        {
            var catalog = _Context.Session[API_CATALOG_KEY] as JohnDeereCatalog;

            if (catalog == null)
            {
                using (var catalogResponse = await client.GetAsync(string.Empty))
                {
                    catalog = await DeserializeAsync<JohnDeereCatalog>(catalogResponse);
                }

                _Context.Session[API_CATALOG_KEY] = catalog;
            }

            return catalog;
        }

        private async Task<ServiceProviderDescription> GetServiceDescription()
        {
            using (var client = CreateClient())
            {
                var catalog = await GetCatalog(client);

                return new ServiceProviderDescription
                {
                    AccessTokenEndpoint = new MessageReceivingEndpoint(GetUri("oauthAccessToken", catalog), HttpDeliveryMethods.PostRequest),
                    ProtocolVersion = ProtocolVersion.V10a,
                    RequestTokenEndpoint = new MessageReceivingEndpoint(GetUri("oauthRequestToken", catalog), HttpDeliveryMethods.PostRequest),
                    TamperProtectionElements = new ITamperProtectionChannelBindingElement[]
                    {
                        new HmacSha1SigningBindingElement()
                    },
                    UserAuthorizationEndpoint = new MessageReceivingEndpoint(GetUri("oauthAuthorizeRequestToken", catalog), HttpDeliveryMethods.GetRequest)
                };
            }
        }

        private static Uri GetUri(string rel, JohnDeereCatalog catalog)
        {
            var uri = catalog.Links.Where(link => StringComparer.Ordinal.Equals(rel, link.Rel)).Select(link => link.Uri).FirstOrDefault();

            if (uri == null)
            {
                return null;
            }

            var builder = new UriBuilder(uri);
            builder.Query = string.Empty;

            return builder.Uri;
        }

        public void RequestAuthentication(Uri callback)
        {
            var request = _WebWorker.PrepareRequestUserAuthorization(callback, null, null);

            var response = _WebWorker.Channel.PrepareResponse(request);
            response.Send(_Context);
        }

        public async Task<AuthenticationResult> VerifyAuthentication()
        {
            var authorizationResponse = _WebWorker.ProcessUserAuthorization(_Context.Request);
            var accessToken = authorizationResponse.AccessToken;

            AccessToken = accessToken;

            using (var client = CreateClient())
            {
                var catalog = await GetCatalog(client);
                var userUri = GetUri("currentUser", catalog);

                using (var userResponse = await client.GetAsync(userUri.PathAndQuery))
                {
                    var profile = await DeserializeAsync<JohnDeereUser>(userResponse);

                    var extraData = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    extraData.Add("accessToken", accessToken);
                    extraData.Add("givenName", profile.GivenName);
                    extraData.Add("familyName", profile.FamilyName);
                    extraData.Add("userType", profile.UserType);

                    return new AuthenticationResult(true, ProviderName, profile.AccountName, profile.AccountName, extraData);
                }
            }
        }

        public async Task BroadcastPrescription(string fileName, string contentType, Stream fileStream)
        {
            using (var client = CreateClient())
            {
                var catalog = await GetCatalog(client);
                var organizationsUriBuilder = new UriBuilder(GetUri("organizations", catalog))
                {
                    Query = "count=100"
                };
                JohnDeereEnumerable<JohnDeereOrganization> organizations;

                using(var organizationsResponse = await client.GetAsync(organizationsUriBuilder.Uri.PathAndQuery))
                {
                    organizations = await DeserializeAsync<JohnDeereEnumerable<JohnDeereOrganization>>(organizationsResponse);
                }

                var fileStreamPosition = fileStream.Position;
                    
                foreach (var organization in organizations)
                {
                    var createFileUri = GetUri("uploadFile", organization);

                    if(createFileUri != null)
                    {
                        var file = new JohnDeereFile
                        {
                            Name = fileName
                        };
                        var createFileContent = new ObjectContent<JohnDeereFile>(file, JsonFormatter, JsonMediaTypeHeaderValue);
                        Uri uploadFileUri;

                        using (var createFileResponse = await client.PostAsync(createFileUri.PathAndQuery, createFileContent))
                        {
                            if (createFileResponse.StatusCode == HttpStatusCode.Created)
                            {
                                uploadFileUri = createFileResponse.Headers.Location;
                            }
                            else
                            {
                                uploadFileUri = null;
                            }
                        }

                        fileStream.Seek(fileStreamPosition, SeekOrigin.Begin);

                        var uploadFileContent = new StreamContent(fileStream);
                        uploadFileContent.Headers.ContentType = JsonMediaTypeHeaderValue;

                        using (var uploadFileResponse = await client.PutAsync(uploadFileUri.PathAndQuery, uploadFileContent))
                        {
                        }

                        var transferFileUri = GetUri("sendFileToMachine", organization);

                        using (var transferFileResponse = await client.PostAsync(transferFileUri.PathAndQuery, null))
                        {
                        }
                    }
                }
            }
        }
    }
}