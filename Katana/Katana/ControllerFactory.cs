using System;
using System.Web.Mvc;
using System.Web.Routing;
using Katana.Controllers;

namespace Katana
{
    internal sealed class ControllerFactory : DefaultControllerFactory
    {
        private readonly AppManagerService m_AppManager;

        public ControllerFactory(AppManagerService appManager)
        {
            m_AppManager = appManager;
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            if(controllerType == typeof(AppsController))
            {
                return new AppsController(m_AppManager);
            }

            if (controllerType == typeof(OAuthController))
            {
                return new OAuthController(m_AppManager);
            }

            return base.GetControllerInstance(requestContext, controllerType);
        }
    }
}