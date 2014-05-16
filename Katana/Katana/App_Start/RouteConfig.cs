using System.Web.Mvc;
using System.Web.Routing;

namespace Katana
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new { controller = "oauth", action = "authorize", id = UrlParameter.Optional }
            );
        }
    }
}