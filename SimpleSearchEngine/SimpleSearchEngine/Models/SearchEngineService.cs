using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Schema;

namespace Magurany.SimpleSearchEngine.Web.Models
{
	internal sealed class SearchEngineService : ISearchEngine
	{
		private readonly IFilePathResolver m_Resolver;
		private static readonly IDictionary<string, WordReference> s_Words = new Dictionary<string, WordReference>(StringComparer.OrdinalIgnoreCase);
		private static readonly IDictionary<string, FileReference> s_Files = new Dictionary<string, FileReference>(StringComparer.OrdinalIgnoreCase);
		private static bool s_Initialized;

		public SearchEngineService(IServiceProvider serviceProvider)
		{
			m_Resolver = (IFilePathResolver)serviceProvider.GetService(typeof(IFilePathResolver));

			lock(typeof(SearchEngineService))
			{
				if(!s_Initialized)
				{
					LoadIndex(m_Resolver);

					s_Initialized = true;
				}
			}
		}

		private static void LoadIndex(IFilePathResolver resolver)
		{
			using(Stream indexStream = new FileStream(resolver.MapPath("~/App_Data/Index.xml"), FileMode.Open, FileAccess.Read, FileShare.None))
			{
				const string ns = "http://schemas.magurany.com/search";

				XmlSchemaSet schemas = new XmlSchemaSet();
				schemas.Add(ns, resolver.MapPath("~/App_Data/Index.xsd"));

				XmlReaderSettings settings = new XmlReaderSettings();
				settings.IgnoreComments = true;
				settings.IgnoreWhitespace = true;
				settings.Schemas = schemas;

				XmlReader reader = XmlReader.Create(indexStream, settings);

				reader.ReadStartElement("Index", ns);

				reader.ReadStartElement("Words", ns);

				while(reader.IsStartElement("Word", ns))
				{
					WordReference wordRef = new WordReference();

					reader.MoveToAttribute("Word");
					wordRef.Word = reader.ReadContentAsString();

					reader.MoveToAttribute("Count");
					wordRef.Count = reader.ReadContentAsInt();

					reader.ReadStartElement("Word", ns);

					while(reader.IsStartElement("File", ns))
					{
						reader.MoveToAttribute("Path");
						string path = reader.ReadContentAsString();

						reader.MoveToAttribute("Count");
						int count = reader.ReadContentAsInt();

						wordRef.Files.Add(path, count);

						reader.ReadStartElement("File", ns);
					}

					s_Words.Add(wordRef.Word, wordRef);

					reader.ReadEndElement();
				}

				reader.ReadEndElement();

				reader.ReadStartElement("Files", ns);

				while(reader.IsStartElement("File", ns))
				{
					FileReference fileRef = new FileReference();

					reader.MoveToAttribute("Path");
					fileRef.Path = reader.ReadContentAsString();

					reader.MoveToAttribute("Title");
					fileRef.Title = reader.ReadContentAsString();

					reader.MoveToAttribute("Preview");
					fileRef.Preview = reader.ReadContentAsString();

					s_Files.Add(fileRef.Path, fileRef);

					reader.ReadStartElement("File", ns);
				}

				reader.ReadEndElement();

				reader.ReadEndElement();
			}
		}

		public IEnumerable<SearchResult> Search(SearchQuery query)
		{
			if(query == null)
			{
				throw new ArgumentNullException("query");
			}

			IDictionary<string, SearchResult> results = new Dictionary<string, SearchResult>(StringComparer.OrdinalIgnoreCase);

			if(!string.IsNullOrWhiteSpace(query.SearchTerms))
			{
				Regex wordPattern = new Regex(@"[a-z1-9]{3,}", RegexOptions.Compiled | RegexOptions.IgnoreCase);
				MatchCollection wordMatches = wordPattern.Matches(query.SearchTerms);

				foreach(Match match in wordMatches)
				{
					if(s_Words.ContainsKey(match.Value))
					{
						WordReference wordRef = s_Words[match.Value];
						
						foreach(KeyValuePair<string, int> pair in wordRef.Files)
						{
							FileReference fileRef = s_Files[pair.Key];
							SearchResult result;

							if (results.ContainsKey(fileRef.Path))
							{
								result = results[fileRef.Path];
							}
							else
							{
								result = new SearchResult();
								result.Url = "/Files/" + Path.GetFileName(fileRef.Path);
								result.Title = fileRef.Title;
								result.Preview = fileRef.Preview;

								results.Add(fileRef.Path, result);
							}

							result.Rank += pair.Value;
						}
					}
				}
			}

			return results.Values.OrderByDescending(result => result.Rank);
		}

		public IEnumerable<string> Suggest(SearchQuery query, int count)
		{
			if(!string.IsNullOrWhiteSpace(query.SearchTerms))
			{
				return (from wordRef in s_Words.Values
						where wordRef.Word.Contains(query.SearchTerms)
						orderby wordRef.Count descending
						select wordRef.Word).Take(count);
			}

			return new string[0];
		}
	}
}