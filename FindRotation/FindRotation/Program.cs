using System;

namespace FindRotation
{
	class Program
	{
		private static int s_Count;

		static void Main(string[] args)
		{
			int[] array = new int[args.Length];

			for(int i = 0; i < args.Length; i++)
			{
				array[i] = int.Parse(args[i]);
			}

			int index = FindRotation(array);

			Console.WriteLine(index);
		}

		static int FindRotation(int[] array)
		{
			if(array.Length == 0)
			{
				return -1;
			}

			//int last = array[0];

			//for(int i = 1; i < array.Length; i++)
			//{
			//    if(array[i] < last)
			//    {
			//        return i;
			//    }

			//    last = array[i];
			//}

			//return -1;
			return FindRotation(array, 0, array.Length);
		}

		static int FindRotation(int[] array, int start, int length)
		{
			s_Count++;

			int left = array[start];
			int right = array[start + length - 1];

			if(left < right)
			{
				return start;
			}

			int half = length / 2;

			if(half < 1)
			{
				return -1;
			}

			int middle = start + half;

			if(left <= array[middle - 1])
			{
				return FindRotation(array, middle, length - half);
			}

			return FindRotation(array, start, half);
		}
	}
}
