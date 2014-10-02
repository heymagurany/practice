using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using DotNetOpenAuth.AspNet;
using DotNetOpenAuth.AspNet.Clients;
using DotNetOpenAuth.Messaging;
using DotNetOpenAuth.OAuth;
using DotNetOpenAuth.OAuth.ChannelElements;
using Newtonsoft.Json;

namespace OAuth1.Models
{
    public sealed class JohnDeereClient
    {
        private readonly string _BaseAddress;
        private readonly HttpContextBase _Context;
        private IConsumerTokenManager _TokenManager;
        private WebConsumer _WebWorker;

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

        public string ProviderName
        {
            get
            {
                return "JohnDeere";
            }
        }

        private HttpClient CreateClient(string accessToken = null)
        {
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
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.deere.axiom.v3+json"));

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

        private async Task<ServiceProviderDescription> GetServiceDescription()
        {
            using (var client = CreateClient())
            using (var response = await client.GetAsync(string.Empty))
            {
                var catalog = await DeserializeAsync<JohnDeereCatalog>(response);
                var links = catalog.Links;

                return new ServiceProviderDescription
                {
                    AccessTokenEndpoint = new MessageReceivingEndpoint(GetUri("oauthAccessToken", links), HttpDeliveryMethods.PostRequest),
                    ProtocolVersion = ProtocolVersion.V10a,
                    RequestTokenEndpoint = new MessageReceivingEndpoint(GetUri("oauthRequestToken", links), HttpDeliveryMethods.PostRequest),
                    TamperProtectionElements = new ITamperProtectionChannelBindingElement[]
                    {
                        new HmacSha1SigningBindingElement()
                    },
                    UserAuthorizationEndpoint = new MessageReceivingEndpoint(GetUri("oauthAuthorizeRequestToken", links), HttpDeliveryMethods.GetRequest)
                };
            }
        }

        private static Uri GetUri(string rel, IEnumerable<JohnDeereLink> links)
        {
            var uri = links.Where(link => StringComparer.Ordinal.Equals(rel, link.Rel)).Select(link => link.Uri).FirstOrDefault();

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
            
            using(var client = CreateClient(accessToken))
            using(var userResponse = await client.GetAsync("users/@currentuser"))
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
}