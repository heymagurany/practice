using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Xml;
using Magurany.SimpleSearchEngine;

namespace Magurany.SimpleIndexer
{
	class Program
	{
		static void Main(string[] args)
		{
			if(args.Length != 2)
			{
				Console.WriteLine("usage:");
				Console.WriteLine("mIndexer DirectoryToSearch Index.xml");

				return;
			}

			DirectoryInfo sourceDir = new DirectoryInfo(args[0]);
			FileInfo indexFile = new FileInfo(args[1]);

			if(!sourceDir.Exists)
			{
				Console.WriteLine("The directory, '{0},' was not found.", sourceDir);

				return;
			}

			FileInfo[] sourceFiles = sourceDir.GetFiles("*.txt");

			if(sourceFiles.Length == 0)
			{
				Console.WriteLine("The directory, '{0},' does not contain any text files.", sourceDir);

				return;
			}

			bool proceed = false;

			while(!proceed && indexFile.Exists)
			{
				Console.Write("The file, '{0},' exists. Overwrite? [y/n] ", indexFile);

				ConsoleKeyInfo yesNo = Console.ReadKey(false);
				
				if(ConsoleKey.N == yesNo.Key)
				{
					return;
				}

				proceed = ConsoleKey.Y == yesNo.Key;

				Console.WriteLine();
			}

			if(!indexFile.Directory.Exists)
			{
				indexFile.Directory.Create();
			}

			IDictionary<string, WordReference> words = new Dictionary<string, WordReference>(StringComparer.OrdinalIgnoreCase);
			IList<FileReference> files = new List<FileReference>(sourceFiles.Length);
			Regex wordPattern = new Regex(@"[a-z1-9]{3,}", RegexOptions.Compiled | RegexOptions.IgnoreCase);
			Regex previewPattern = new Regex(@"[^ ]+", RegexOptions.Compiled | RegexOptions.IgnoreCase);

			foreach(FileInfo sourceFile in sourceFiles)
			{
				FileReference fileRef = new FileReference();
				fileRef.Path = sourceFile.FullName;
				fileRef.Preview = string.Empty;
				fileRef.Title = sourceFile.Name;

				using(Stream sourceStream = sourceFile.OpenRead())
				{
					TextReader reader = new StreamReader(sourceStream);
					string line;

					while((line = reader.ReadLine()) != null)
					{
						if(!string.IsNullOrWhiteSpace(line))
						{
							if(fileRef.Preview.Length < 250)
							{
								MatchCollection previewMatches = previewPattern.Matches(line);

								foreach(Match previewMatch in previewMatches)
								{
									fileRef.Preview += previewMatch.Value + " ";
								}
							}

							MatchCollection wordMatches = wordPattern.Matches(line);
							
							foreach(Match match in wordMatches)
							{
								string word = match.Value;
								WordReference wordRef;

								if(words.ContainsKey(word))
								{
									wordRef = words[word];
								}
								else
								{
									wordRef = new WordReference();
									wordRef.Word = word;

									words.Add(word, wordRef);
								}

								wordRef.Count++;

								if(wordRef.Files.ContainsKey(sourceFile.FullName))
								{
									wordRef.Files[sourceFile.FullName]++;
								}
								else
								{
									wordRef.Files.Add(sourceFile.FullName, 1);
								}
							}
						}
					}

					files.Add(fileRef);
				}
			}

			using(Stream indexStream = indexFile.Open(FileMode.Create, FileAccess.Write, FileShare.None))
			{
				const string ns = "http://schemas.magurany.com/search";

				XmlWriterSettings settings = new XmlWriterSettings();
				settings.Indent = true;
				
				XmlWriter writer = XmlWriter.Create(indexStream, settings);
				writer.WriteStartDocument();
				writer.WriteStartElement("Index", ns);

				writer.WriteStartElement("Words", ns);

				foreach(WordReference wordRef in words.Values)
				{
					writer.WriteStartElement("Word", ns);
					writer.WriteAttributeString("Word", wordRef.Word);
					writer.WriteAttributeString("Count", wordRef.Count.ToString());

					foreach(KeyValuePair<string, int> pair in wordRef.Files)
					{
						writer.WriteStartElement("File", ns);
						writer.WriteAttributeString("Path", pair.Key);
						writer.WriteAttributeString("Count", pair.Value.ToString());
						writer.WriteEndElement();
					}

					writer.WriteEndElement();
				}

				writer.WriteEndElement();

				writer.WriteStartElement("Files", ns);

				foreach(FileReference wordRef in files)
				{
					writer.WriteStartElement("File", ns);
					writer.WriteAttributeString("Path", wordRef.Path);
					writer.WriteAttributeString("Title", wordRef.Title);
					writer.WriteAttributeString("Preview", wordRef.Preview);
					writer.WriteEndElement();
				}

				writer.WriteEndElement();

				writer.WriteEndElement();

				writer.Flush();
			}
		}
	}
}
