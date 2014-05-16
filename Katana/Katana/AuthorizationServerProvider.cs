using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;

namespace Katana
{
    internal sealed class AuthorizationServerProvider : IOAuthAuthorizationServerProvider
    {
        private readonly AppManagerService m_AppManager;

        public AuthorizationServerProvider(AppManagerService appManager)
        {
            m_AppManager = appManager;
        }

        public Task MatchEndpoint(OAuthMatchEndpointContext context)
        {
            return Task.FromResult(true);
        }

        public Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(context.ClientId, a.ClientId));

            if(app != null)
            {
                context.Validated(app.RedirectUri);
            }

            return Task.FromResult(true);
        }

        public Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId;
            string clientSecret;

            if(context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(clientId, a.ClientId) && StringComparer.OrdinalIgnoreCase.Equals(clientSecret, a.ClientSecret));

                if (app != null)
                {
                    context.Validated(app.ClientId);
                }
            }

            return Task.FromResult(true);
        }

        public Task ValidateAuthorizeRequest(OAuthValidateAuthorizeRequestContext context)
        {
            var app = m_AppManager.GetApps().FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(context.ClientContext.ClientId, a.ClientId));

            if (app != null)
            {
                context.Validated();
            }

            return Task.FromResult(true);
        }

        public Task ValidateTokenRequest(OAuthValidateTokenRequestContext context)
        {
            context.Validated();

            return Task.FromResult(true);
        }

        public Task GrantAuthorizationCode(OAuthGrantAuthorizationCodeContext context)
        {
            context.Validated(context.Ticket);

            return Task.FromResult(true);
        }

        public Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            context.Validated(context.Ticket);

            return Task.FromResult(true);
        }

        public Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.Validated(context.Ticket);

            return Task.FromResult(true);
        }

        public Task GrantClientCredentials(OAuthGrantClientCredentialsContext context)
        {
            context.Validated(context.Ticket);

            return Task.FromResult(true);
        }

        public Task GrantCustomExtension(OAuthGrantCustomExtensionContext context)
        {
            throw new NotSupportedException();
        }

        public Task AuthorizeEndpoint(OAuthAuthorizeEndpointContext context)
        {
            return Task.FromResult(true);
        }

        public Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            return Task.FromResult(true);
        }
    }
}