using System;
using System.Web;

namespace Magurany.SimpleSearchEngine.Web.Models
{
	public class ServiceFactory : IServiceProvider
	{
		private readonly HttpRequestBase m_Request;

		public ServiceFactory(HttpRequestBase request)
		{
			m_Request = request;
		}

		public object GetService(Type serviceType)
		{
			if(typeof(IFilePathResolver) == serviceType)
			{
				return new FilePathResolver(m_Request);
			}

			if(typeof(ISearchEngine) == serviceType)
			{
				return new SearchEngineService(this);
			}

			return null;
		}
	}
}