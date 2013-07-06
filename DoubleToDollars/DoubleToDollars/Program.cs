using System;

namespace DoubleToDollars
{
	class Program
	{
		static void Main(string[] args)
		{
			double input = double.Parse(args[0]);
			string output = ToDollarsString(input);

			Console.WriteLine(output);
		}

		static string ToDollarsString(double value)
		{
			bool isNegative = value < 0;

			if(isNegative)
			{
				value = value * -1;
			}

			long left = (long)value;
			long right = (long)(value % 1 * 100);
			string result = string.Empty;
			int count = 1;

			do
			{
				long digit = left % 10;
				
				result = digit + result;
				
				int offset = count % 3;
				if(offset == 0)
				{
					result = ',' + result;
				}
				
				left = left / 10;
				count++;
			}
			while(left > 0);

			result = '$' + result + '.' + right;

			if(isNegative)
			{
				result = '-' + result;
			}

			return result;
		}
	}
}
