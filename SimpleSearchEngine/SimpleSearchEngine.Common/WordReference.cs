using System;
using System.Collections.Generic;

namespace Magurany.SimpleSearchEngine
{
	public sealed class WordReference
	{
		public WordReference()
		{
			Files = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
		}

		public string Word { get; set; }

		public int Count { get; set; }

		public Dictionary<string, int> Files { get; private set; }
	}
}