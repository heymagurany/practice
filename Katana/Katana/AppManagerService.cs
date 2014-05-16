using System.Collections.Generic;
using Katana.Models;

namespace Katana
{
    internal sealed class AppManagerService
    {
        private static readonly IDictionary<string, AppModel> s_Apps = new Dictionary<string, AppModel>();
 
        public ICollection<AppModel> GetApps()
        {
            return s_Apps.Values;
        }

        public void DeleteApp(string clientId)
        {
            s_Apps.Remove(clientId);
        }

        public void EditApp(AppModel app)
        {
            if(s_Apps.ContainsKey(app.ClientId))
            {
                s_Apps[app.ClientId] = app;
            }
        }

        public void RegisterApp(AppModel app)
        {
            s_Apps.Add(app.ClientId, app);
        }
    }
}