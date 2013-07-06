namespace Magurany.SimpleSearchEngine.Web.Models
{
	public class SearchQuery
	{
		public SearchType SearchType { get; set; }

		public string SearchTerms { get; set; }

		public override string ToString()
		{
			return string.Format("Type: {0}, Terms: {1}", SearchType, SearchTerms);
		}
	}
}