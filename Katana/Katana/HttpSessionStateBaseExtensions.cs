using System.Collections.Generic;
using System.Web;
using Katana.Models;

namespace Katana
{
    internal static class HttpSessionStateBaseExtensions
    {
        private const string REGISTERED_APPS_KEY = "RegisteredApps";

        public static IList<AppModel> GetRegisteredApps(this HttpSessionStateBase session)
        {
            var apps = session[REGISTERED_APPS_KEY] as IList<AppModel>;

            if(apps == null)
            {
                return new List<AppModel>();
            }

            return apps;
        }

        public static void SaveRegisteredApps(this HttpSessionStateBase session, IList<AppModel> apps)
        {
            session[REGISTERED_APPS_KEY] = apps;
        }
    }
}