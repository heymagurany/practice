using System;
using System.Net;
using System.Web.Mvc;
using Magurany.SimpleSearchEngine.Web.Controllers;
using Magurany.SimpleSearchEngine.Web.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Rhino.Mocks;

namespace SimpleSearchEngine.Tests
{
	/// <summary>
	///This is a test class for HomeControllerTest and is intended
	///to contain all HomeControllerTest Unit Tests
	///</summary>
	[TestClass]
	public class HomeControllerTest
	{
		/// <summary>
		/// Gets or sets the test context which provides
		/// information about and functionality for the current test run.
		/// </summary>
		public TestContext TestContext { get; set; }

		/// <summary>
		/// Tests that the index action will return a view result.
		/// </summary>
		[TestMethod]
		public void Index()
		{
			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();

			HomeController target = new HomeController(serviceProvider);

			ActionResult actual = target.Index();

			Assert.IsInstanceOfType(actual, typeof(ViewResult));
		}

		/// <summary>
		/// Tests that a valid query returns results.
		/// </summary>
		[TestMethod]
		public void SearchValidQuery()
		{
			SearchQuery query = new SearchQuery { SearchType = SearchType.Web, SearchTerms = "Test" };
			SearchResult[] results = { new SearchResult { Url = "http://www.example.com", Title = "Test Title", Preview = "This is a test test result." } };

			ISearchEngine engine = MockRepository.GenerateMock<ISearchEngine>();
			engine.Stub(e => e.Search(query)).Return(results);

			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();
			serviceProvider.Stub(sp => sp.GetService(typeof(ISearchEngine))).Return(engine);

			HomeController target = new HomeController(serviceProvider);

			JsonResult expected = new JsonResult();
			expected.Data = results;

			JsonResult actual = (JsonResult)target.Search(query);

			Assert.AreEqual(expected.Data, actual.Data);
		}

		/// <summary>
		/// Tests that a null query will return HTTP status code of 500
		/// </summary>
		[TestMethod]
		public void SearchNullQuery()
		{
			ISearchEngine engine = MockRepository.GenerateMock<ISearchEngine>();
			engine.Stub(e => e.Search(null)).Throw(new ArgumentNullException("query"));

			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();
			serviceProvider.Stub(sp => sp.GetService(typeof(ISearchEngine))).Return(engine);

			HomeController target = new HomeController(serviceProvider);

			HttpStatusCodeResult expected = new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
			HttpStatusCodeResult actual = (HttpStatusCodeResult)target.Search(null);

			Assert.AreEqual(expected.StatusCode, actual.StatusCode);
		}

		/// <summary>
		/// Tests that a query with null search terms will return a HTTP status code 204.
		/// </summary>
		[TestMethod]
		public void SearchNullSearchTerms()
		{
			SearchQuery query = new SearchQuery { SearchType = SearchType.Web, SearchTerms = null };
			SearchResult[] results = new SearchResult[0];

			ISearchEngine engine = MockRepository.GenerateMock<ISearchEngine>();
			engine.Stub(e => e.Search(query)).Return(results);

			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();
			serviceProvider.Stub(sp => sp.GetService(typeof(ISearchEngine))).Return(engine);

			HomeController target = new HomeController(serviceProvider);

			HttpStatusCodeResult expected = new HttpStatusCodeResult(HttpStatusCode.NoContent);
			HttpStatusCodeResult actual = (HttpStatusCodeResult)target.Search(query);

			Assert.AreEqual(expected.StatusCode, actual.StatusCode);
		}

		/// <summary>
		/// Tests that a query with empty search terms will return a HTTP status code 204.
		/// </summary>
		[TestMethod]
		public void SearchEmptySearchTerms()
		{
			SearchQuery query = new SearchQuery { SearchType = SearchType.Web, SearchTerms = string.Empty };
			SearchResult[] results = new SearchResult[0];

			ISearchEngine engine = MockRepository.GenerateMock<ISearchEngine>();
			engine.Stub(e => e.Search(query)).Return(results);

			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();
			serviceProvider.Stub(sp => sp.GetService(typeof(ISearchEngine))).Return(engine);

			HomeController target = new HomeController(serviceProvider);

			HttpStatusCodeResult expected = new HttpStatusCodeResult(HttpStatusCode.NoContent);
			HttpStatusCodeResult actual = (HttpStatusCodeResult)target.Search(query);

			Assert.AreEqual(expected.StatusCode, actual.StatusCode);
		}

		/// <summary>
		/// Tests that a query with whitespace search terms will return a HTTP status code 204.
		/// </summary>
		[TestMethod]
		public void SearchWhitespaceSearchTerms()
		{
			SearchQuery query = new SearchQuery { SearchType = SearchType.Web, SearchTerms = " \t\n\r" };
			SearchResult[] results = new SearchResult[0];

			ISearchEngine engine = MockRepository.GenerateMock<ISearchEngine>();
			engine.Stub(e => e.Search(query)).Return(results);

			IServiceProvider serviceProvider = MockRepository.GenerateMock<IServiceProvider>();
			serviceProvider.Stub(sp => sp.GetService(typeof(ISearchEngine))).Return(engine);

			HomeController target = new HomeController(serviceProvider);

			HttpStatusCodeResult expected = new HttpStatusCodeResult(HttpStatusCode.NoContent);
			HttpStatusCodeResult actual = (HttpStatusCodeResult)target.Search(query);

			Assert.AreEqual(expected.StatusCode, actual.StatusCode);
		}
	}
}
