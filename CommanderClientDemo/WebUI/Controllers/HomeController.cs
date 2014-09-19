using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using WebUI.Models;

namespace WebUI.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            ViewBag.ErrorMessage = Session["ErrorMessage"];

            var token = Session["Token"] as SimpleWebToken;
            var baseAddress = ConfigurationManager.AppSettings["CommanderBaseAddress"];

            if (token == null)
            {
                var clientID = ConfigurationManager.AppSettings["CommanderClientID"];
                var redirectUri = Server.UrlEncode(ConfigurationManager.AppSettings["CommanderRedirectUri"]);

                ViewBag.CommanderAuthUrl = string.Format("{0}/oauth/authorize?client_id={1}&response_type=code&redirect_uri={2}", baseAddress, clientID, redirectUri);

                return View();
            }

            if(DateTime.UtcNow > token.ExpiresOn)
            {
                var tokenRequestParameters = new Dictionary<string, string>
                {
                    { "grant_type", "refresh_token" },
                    { "refresh_token", token.RefreshToken }
                };

                Session["Token"] = token = await RequestToken(tokenRequestParameters);
            }

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseAddress);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);

                using (var userResponse = await client.GetAsync("/api/user"))
                {
                    var envelope = await Deserialize<CommanderUserEnvelope>(userResponse.Content);

                    return View(envelope.Data);
                }
            }
        }

        public async Task<ActionResult> Authorized(string code, string error, string error_description)
        {
            if (string.IsNullOrWhiteSpace(error))
            {
                var tokenRequestParameters = new Dictionary<string, string>
                {
                    { "grant_type", "authorization_code" },
                    { "code", code }
                };

                Session["ErrorMessage"] = null;
                Session["Token"] = await RequestToken(tokenRequestParameters);
            }
            else
            {
                Session["ErrorMessage"] = error_description;
                Session["Token"] = null;
            }

            return RedirectToAction("Index");
        }

        public ActionResult Reset()
        {
            Session.Abandon();

            return RedirectToAction("Index");
        }

        private static async Task<T> Deserialize<T>(HttpContent content)
        {
            using (var stream = await content.ReadAsStreamAsync())
            using (var textReader = new StreamReader(stream))
            using (var jsonReader = new JsonTextReader(textReader))
            {
                var serializer = JsonSerializer.CreateDefault();

                return serializer.Deserialize<T>(jsonReader);
            }
        }

        private static async Task<SimpleWebToken> RequestToken(IEnumerable<KeyValuePair<string, string>> tokenRequestParameters)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ConfigurationManager.AppSettings["CommanderBaseAddress"]);

                var clientID = ConfigurationManager.AppSettings["CommanderClientID"];
                var clientSecret = ConfigurationManager.AppSettings["CommanderClientSecret"];
                var basicCredentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(clientID + ":" + clientSecret));

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicCredentials);

                var redirectUri = ConfigurationManager.AppSettings["CommanderRedirectUri"];
                var tokenRequestContent = new FormUrlEncodedContent(tokenRequestParameters);

                using (var tokenResponse = await client.PostAsync("oauth/token", tokenRequestContent))
                {
                    var token = await Deserialize<SimpleWebToken>(tokenResponse.Content);
                    token.ExpiresOn = DateTime.UtcNow.AddSeconds(token.ExpiresIn);

                    return token;
                }
            }
        }
    }
}