﻿using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Katana.Models;
using Microsoft.Owin.Security.OAuth;

namespace Katana.Controllers
{
    [Authorize]
    public sealed class OAuthController : Controller
    {
        private readonly AppManagerService m_AppManager;

        internal OAuthController(AppManagerService appManager)
        {
            m_AppManager = appManager;
        }

        [HttpGet]
        public ActionResult Authorize(string client_id, string scope)
        {
            if(Response.StatusCode == 200)
            {
                var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(client_id, a.ClientId));

                if(app == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }

                return View(app);
            }

            return new HttpStatusCodeResult(Response.StatusCode);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public void Authorize(string scope, bool accept)
        {
            if (accept)
            {
                var authentication = HttpContext.GetOwinContext().Authentication;
                var identity = authentication.User.Identities.First();

                if (!string.IsNullOrWhiteSpace(scope))
                {
                    string[] scopes = scope.Split(' ');

                    foreach (var singleScope in scopes)
                    {
                        identity.AddClaim(new Claim("urn:oauth:scope", singleScope.Trim()));
                    }
                }

                identity = new ClaimsIdentity(identity.Claims, OAuthDefaults.AuthenticationType, identity.NameClaimType, identity.RoleClaimType);

                authentication.SignIn(identity);
            }
        }
    }
}