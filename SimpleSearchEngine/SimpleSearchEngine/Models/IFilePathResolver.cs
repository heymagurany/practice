namespace Magurany.SimpleSearchEngine.Web.Models
{
	public interface IFilePathResolver
	{
		string MapPath(string virtualPath);
	}
}
