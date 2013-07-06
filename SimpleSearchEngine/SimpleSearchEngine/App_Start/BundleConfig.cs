using System.Web.Optimization;

namespace Magurany.SimpleSearchEngine.Web.App_Start
{
	public class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			Bundle commonStylesBundle = new StyleBundle("~/bundles/css");
			commonStylesBundle.Include(
				"~/Content/bootstrap.css",
				"~/Content/bootstrap-responsive.css",
				"~/Content/site.css");

			Bundle commonScriptsBundle = new ScriptBundle("~/bundles/js");
			commonScriptsBundle.Include(
				"~/Scripts/jquery-{version}.js",
				"~/Scripts/jquery.unobtrusive-ajax.js",
				"~/Scripts/bootstrap.js",
				"~/Scripts/knockout-{version}.js",
				"~/Scripts/site.js");

			bundles.Add(commonStylesBundle);
			bundles.Add(commonScriptsBundle);
		}
	}
}