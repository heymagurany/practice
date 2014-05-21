using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Microsoft.Owin.Security.OAuth;
using System;

namespace Katana
{
    public class Startup
    {
        internal static readonly AppManagerService AppManager = new AppManagerService();

        public void Configuration(IAppBuilder app)
        {
            //var appManager = new AppManagerService();

            app.Properties.Add("Katana.AppManagerService", AppManager);

            ConfigureAuthentication(app);
            ConfigureAuthorizationServer(app);
        }

        private void ConfigureAuthentication(IAppBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                AuthenticationMode = AuthenticationMode.Active,
                LoginPath = new PathString("/account/login"),
                LogoutPath = new PathString("/account/logout")
            });
        }

        private void ConfigureAuthorizationServer(IAppBuilder app)
        {
            // Setup Authorization Server
            app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
            {
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(365),
                AuthorizeEndpointPath = new PathString("/oauth/authorize"),
                TokenEndpointPath = new PathString("/oauth/token"),
                ApplicationCanDisplayErrors = true,
#if DEBUG
                AllowInsecureHttp = true,
#endif
                // Authorization server provider which controls the lifecycle of Authorization Server
                Provider = new AuthorizationServerProvider(AppManager),
                // Authorization code provider which creates and receives the authorization code.
                AuthorizationCodeProvider = new AuthorizationCodeProvider(),
                // Refresh token provider which creates and receives refresh token.
                RefreshTokenProvider = new AuthorizationCodeProvider()
            });
        }

        private void ConfigureResourceServer(IAppBuilder app)
        {
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }

        private void ConfigureWebApi(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional }
            );

            app.UseWebApi(config);
        }
    }
}