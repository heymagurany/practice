using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Magurany.SimpleSearchEngine.Web.App_Start;
using Magurany.SimpleSearchEngine.Web.Controllers;

namespace Magurany.SimpleSearchEngine.Web
{
	public class MvcApplication : HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			ControllerBuilder.Current.SetControllerFactory(typeof(ControllerFactory));

			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}
	}
}