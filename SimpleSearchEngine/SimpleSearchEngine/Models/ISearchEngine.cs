using System.Collections.Generic;

namespace Magurany.SimpleSearchEngine.Web.Models
{
	public interface ISearchEngine
	{
		IEnumerable<SearchResult> Search(SearchQuery query);
		IEnumerable<string> Suggest(SearchQuery query, int count);
	}
}
