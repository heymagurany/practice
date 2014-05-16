using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Katana.Controllers
{
    [Authorize]
    public class OAuthController : Controller
    {
        [ActionName("access_token")]
        [HttpGet]
        public ActionResult AccessToken()
        {
            throw new NotImplementedException();
        }

        public ActionResult Authenticate(string client_id, string response_type, string redirect_uri, string scope, string state)
        {
            // If the user already authorized the client (and the set of scopes), just redirect to the <redirect_uri>, otherwise show the authorize view.
            return View("Authorize");
        }

        [HttpGet]
        public async Task<ActionResult> Authorize(string client_id, string response_type, string redirect_uri, string scope, string state)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Authorize(string client_id, string response_type, string redirect_uri, string scope, string state, FormCollection form)
        {
            //var authentication = HttpContext.GetOwinContext().Authentication;
            //var ticket = await authentication.AuthenticateAsync("Application");
            //ClaimsIdentity identity;

            //if(ticket != null)
            //{
            //    identity = ticket.Identity;
            //}
            //else
            //{
            //    authentication.Challenge("Application");

            //    return new HttpUnauthorizedResult();
            //}

            //var scopes = (Request.QueryString.Get("scope") ?? "").Split(' ');

            //if (Request.HttpMethod == "POST")
            //{
            //    if (!string.IsNullOrEmpty(Request.Form.Get("submit.Grant")))
            //    {
            //        identity = new ClaimsIdentity(identity.Claims, "Bearer", identity.NameClaimType, identity.RoleClaimType);
            //        foreach (var scope in scopes)
            //        {
            //            identity.AddClaim(new Claim("urn:oauth:scope", scope));
            //        }
            //        authentication.SignIn(identity);
            //    }
            //    if (!string.IsNullOrEmpty(Request.Form.Get("submit.Login")))
            //    {
            //        authentication.SignOut("Application");
            //        authentication.Challenge("Application");
            //        return new HttpUnauthorizedResult();
            //    }
            //}

            return View();
        }
	}
}