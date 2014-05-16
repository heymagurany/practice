using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;

namespace Katana.Controllers
{
    public class AccountController : Controller
    {
        [AllowAnonymous]
        [HttpGet]
        public ActionResult LogIn(string returnUrl)
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogIn(string returnUrl, FormCollection form)
        {
            var authentication = HttpContext.GetOwinContext().Authentication;

            if (!string.IsNullOrEmpty(form["username"]) && !string.IsNullOrEmpty(form["password"]))
            {
                var isPersistent = !string.IsNullOrEmpty(Request.Form.Get("isPersistent"));

                authentication.SignIn(
                    new AuthenticationProperties
                    {
                        IsPersistent = isPersistent
                    },
                    new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "AUniqueID"),
                        new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "AUniqueID"),
                        new Claim(ClaimsIdentity.DefaultNameClaimType, form["username"])
                    }, DefaultAuthenticationTypes.ApplicationCookie));

                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult LogOut()
        {
            return RedirectToAction("login");
        }
    }
}