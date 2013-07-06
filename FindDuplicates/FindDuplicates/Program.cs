using System;
using System.Collections.Generic;

namespace FindDuplicates
{
	class Program
	{
		static void Main(string[] args)
		{
			ICollection<char> duplicates = FindDuplicates(args[0]);

			foreach(char c in duplicates)
			{
				Console.WriteLine(c);
			}
		}

		public static ICollection<char> FindDuplicates(string input)
		{
			char[] chars = input.ToCharArray();
			IDictionary<char, int> table = new Dictionary<char, int>();
			IList<char> duplicates = new List<char>();

			foreach(char c in chars)
			{
				if(table.ContainsKey(c))
				{
					if(table[c] == 1)
					{
						duplicates.Add(c);
					}

					table[c]++;
				}
				else
				{
					table.Add(c, 1);
				}
			}

			return duplicates;
		}
	}
}
