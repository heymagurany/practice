using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Katana
{
    public class Global : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            //var context = Context.GetOwinContext();
            //var appManager = context.Get<AppManagerService>("Katana.AppManagerService");
            var factory = new ControllerFactory(Startup.AppManager);

            ControllerBuilder.Current.SetControllerFactory(factory);

            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}