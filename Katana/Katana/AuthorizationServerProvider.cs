using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;

namespace Katana
{
    internal sealed class AuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        private readonly AppManagerService m_AppManager;

        public AuthorizationServerProvider(AppManagerService appManager)
        {
            m_AppManager = appManager;
        }

        private static ClaimsIdentity CreateOAuthIdentity(string name, IEnumerable<string> scope)
        {
            Claim[] claims =
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, name)
            };
            var identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType, ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

            foreach(var singleScope in scope)
            {
                var singleScopeTrimmed = singleScope.Trim();

                if(!string.IsNullOrEmpty(singleScopeTrimmed))
                {
                    identity.AddClaim(new Claim("urn:oauth:scope", singleScopeTrimmed));
                }
            }

            return identity;
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(context.ClientId, a.ClientId));

            if(app != null)
            {
                context.Validated(app.RedirectUri);
            }

            return base.ValidateClientRedirectUri(context);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId;
            string clientSecret;

            if(context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(clientId, a.ClientId) && StringComparer.OrdinalIgnoreCase.Equals(clientSecret, a.ClientSecret));

                if(app != null)
                {
                    context.Validated(app.ClientId);
                }
            }

            return base.ValidateClientAuthentication(context);
        }

        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            if(StringComparer.OrdinalIgnoreCase.Equals("client", context.UserName) && StringComparer.Ordinal.Equals("password", context.Password))
            {
                var identity = CreateOAuthIdentity("client", context.Scope);

                context.Validated(identity);
            }

            return base.GrantResourceOwnerCredentials(context);
        }

        public override Task GrantClientCredentials(OAuthGrantClientCredentialsContext context)
        {
            var identity = CreateOAuthIdentity(context.ClientId, context.Scope);

            context.Validated(identity);

            return base.GrantClientCredentials(context);
        }
    }
}