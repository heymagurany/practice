using System;

namespace strrev
{
	class Program
	{
		static void Main(string[] args)
		{
			string input = args[0];

			Strrev(ref input);

			Console.WriteLine(input);
		}

		public static void Strrev(ref string input)
		{
			char[] chars = input.ToCharArray();
			int half = chars.Length / 2;

			for(int i = 0; i < half; i++)
			{
				int end = chars.Length - i - 1;
				char swap = chars[i];
				chars[i] = chars[end];
				chars[end] = swap;
			}

			input = new string(chars);
		}
	}
}
