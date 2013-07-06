using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Web.Mvc;

namespace Magurany.SimpleSearchEngine.Web.Controllers
{
	public class ActionLogAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			TraceSource trace = new TraceSource("Magurany.SimpleSearchEngine");
			ActionDescriptor action = filterContext.ActionDescriptor;
			ControllerDescriptor controller = action.ControllerDescriptor;

			if(filterContext.ActionParameters.Count > 0)
			{
				StringBuilder parameters = new StringBuilder();

				foreach(KeyValuePair<string, object> pair in filterContext.ActionParameters)
				{
					parameters.AppendFormat("{0} = {1}", pair.Key, pair.Value);
				}

				trace.TraceInformation("Action '{0}' executing on controller '{1}' with parameters '{2}.'", action.ActionName, controller.ControllerName, parameters);
			}
			else
			{
				trace.TraceInformation("Action '{0}' executing on controller '{1}' with no parameters.", action.ActionName, controller.ControllerName);
			}
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			TraceSource trace = new TraceSource("Magurany.SimpleSearchEngine");
			ViewResult viewResult = filterContext.Result as ViewResult;
			JsonResult jsonResult = filterContext.Result as JsonResult;
			HttpStatusCodeResult codeResult = filterContext.Result as HttpStatusCodeResult;

			if(viewResult != null)
			{
				trace.TraceInformation("View result, '{0}' executed.", viewResult.ViewName);
			}
			else if(jsonResult != null)
			{
				trace.TraceInformation("JSON result of '{0}' executed.", jsonResult.Data);
			}
			else if(codeResult != null)
			{
				trace.TraceInformation("HTTP status code result, '{0} {1}' executed.", codeResult.StatusCode, codeResult.StatusDescription);
			}
		}
	}
}