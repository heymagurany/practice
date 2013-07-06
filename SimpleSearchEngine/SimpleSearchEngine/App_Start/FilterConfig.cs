using System.Web.Mvc;
using Magurany.SimpleSearchEngine.Web.Controllers;

namespace Magurany.SimpleSearchEngine.Web.App_Start
{
	public class FilterConfig
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
			filters.Add(new ActionLogAttribute());
		}
	}
}