using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Magurany.SimpleSearchEngine.Web.Models;

namespace Magurany.SimpleSearchEngine.Web.Controllers
{
	public class HomeController : Controller
	{
		private readonly ISearchEngine m_Engine;

		public HomeController(IServiceProvider serviceProvider)
		{
			m_Engine = (ISearchEngine)serviceProvider.GetService(typeof(ISearchEngine));
		}

		[HttpGet]
		public ActionResult Index()
		{
			return View();
		}

		[HttpPost]
		public ActionResult Search(SearchQuery query)
		{
			try
			{
				IEnumerable<SearchResult> results = m_Engine.Search(query);

				if(results.Count() > 0)
				{
					return Json(results);
				}

				return new HttpStatusCodeResult(HttpStatusCode.NoContent);
			}
			catch(Exception e)
			{
				return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, e.Message);
			}
		}

		[HttpPost]
		public ActionResult Suggest(SearchQuery query)
		{
			IEnumerable<string> words = m_Engine.Suggest(query, 25);

			if(words.Count() > 0)
			{
				return Json(words);
			}

			return new HttpStatusCodeResult(HttpStatusCode.NoContent);
		}
	}
}