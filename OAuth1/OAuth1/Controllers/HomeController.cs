using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Mvc;
using DotNetOpenAuth.AspNet.Clients;
using DotNetOpenAuth.Messaging;
using DotNetOpenAuth.OAuth;
using DotNetOpenAuth.OAuth.ChannelElements;
using Newtonsoft.Json;
using OAuth1.Models;

namespace OAuth1.Controllers
{
    public class HomeController : Controller
    {
        private static ServiceProviderDescription _Description = new ServiceProviderDescription
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

        private IConsumerTokenManager TokenManager
        {
            get
            {
                return new SimpleConsumerTokenManager(ConfigurationManager.AppSettings["JohnDeereConsumerKey"], ConfigurationManager.AppSettings["JohnDeereConsumerSecret"], new CookieOAuthTokenManager(HttpContext));
            }
        }

        private JohnDeereClient JohnDeere
        {
            get
            {
                return new JohnDeereClient(HttpContext, ConfigurationManager.AppSettings["JohnDeereBaseAddress"], ConfigurationManager.AppSettings["JohnDeereConsumerKey"], ConfigurationManager.AppSettings["JohnDeereConsumerSecret"]);
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Connect()
        {
            var callbackBuilder = new UriBuilder(Request.Url);
            callbackBuilder.Path = "/Home/Authorized";

            //var consumer = new WebConsumer(_Description, TokenManager);
            //var request = consumer.PrepareRequestUserAuthorization(callbackBuilder.Uri, null, null);
            //consumer.Channel.Send(request);
            JohnDeere.RequestAuthentication(callbackBuilder.Uri);

            return RedirectToAction("Index");
        }

        public async Task<ActionResult> Authorized()
        {
            //var consumer = new WebConsumer(_Description, TokenManager);
            //var response = consumer.ProcessUserAuthorization(Request);
            await JohnDeere.VerifyAuthentication();

            return RedirectToAction("Index");
        }
    }
}