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
        public ActionResult LogIn(string returnUrl, string username, string password)
        {
            var authentication = HttpContext.GetOwinContext().Authentication;

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
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
                        new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "MeMyselfAndI"),
                        new Claim(ClaimsIdentity.DefaultNameClaimType, password)
                    }, DefaultAuthenticationTypes.ApplicationCookie));

                return Redirect(returnUrl);
            }

            return View();
        }

        public ActionResult LogOut()
        {
            var authentication = HttpContext.GetOwinContext().Authentication;
            authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie, "Bearer");

            return RedirectToAction("login");
        }
    }
}