using System;
using System.Web.Mvc;
using System.Web.Routing;
using Magurany.SimpleSearchEngine.Web.Models;

namespace Magurany.SimpleSearchEngine.Web.Controllers
{
	public class ControllerFactory : DefaultControllerFactory
	{
		protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
		{
			IServiceProvider serviceProvider = new ServiceFactory(requestContext.HttpContext.Request);

			if(typeof(HomeController) == controllerType)
			{
				return new HomeController(serviceProvider);
			}

			return base.GetControllerInstance(requestContext, controllerType);
		}
	}
}