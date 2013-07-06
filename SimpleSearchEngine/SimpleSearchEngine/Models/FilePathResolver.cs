using System.Web;

namespace Magurany.SimpleSearchEngine.Web.Models
{
	internal sealed class FilePathResolver : IFilePathResolver
	{
		private readonly HttpRequestBase m_Request;

		public FilePathResolver(HttpRequestBase request)
		{
			m_Request = request;
		}

		public string MapPath(string virtualPath)
		{
			return m_Request.MapPath(virtualPath);
		}
	}
}