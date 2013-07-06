using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Wordament
{
	class Program
	{
		static int s_Count;

		static void Main(string[] args)
		{
			char[,] board = { { 'w', 'f', 'e', 'h' }, { 't', 'a', 'b', 'n' }, { 'a', 'e', 'l', 't' }, { 'i', 's', 't', 'd' } };

			IEnumerable<string> words = FindWords(board);

			//foreach(string word in words)
			//{
			//    Console.WriteLine(word);
			//}
		}

		static IEnumerable<string> FindWords(char[,] board)
		{
			List<string> words = new List<string>();
			bool[,] used = new bool[board.GetLength(0), board.GetLength(1)];

			for(int i = 0; i < board.GetLength(0); i++)
			{
				for(int j = 0; j < board.GetLength(1); j++)
				{
					Node current = new Node { X = i, Y = j };

					FindWords(board, current, string.Empty, words, used);
				}
			}

			return words;
		}

		static void FindWords(char[,] board, Node current, string word, List<string> words, bool[,] used)
		{
			s_Count++;

			word += board[current.X, current.Y];

			used[current.X, current.Y] = true;

			IEnumerable<Node> neighbors = GetNeighbors(current, used);

			foreach(Node neighbor in neighbors)
			{
				FindWords(board, neighbor, word, words, used);
			}

			Console.WriteLine(word);

			words.Add(word);

			used[current.X, current.Y] = false;
		}

		static IEnumerable<Node> GetNeighbors(Node current, bool[,] used)
		{
			List<Node> neighbors = new List<Node>();

			for(int i = -1; i < 2; i++)
			{
				int x = current.X + i;

				if((x >= 0) && (x < used.GetLength(0)))
				{
					for(int j = -1; j < 2; j++)
					{
						int y = current.Y + j;

						if((y >= 0) && (y < used.GetLength(1)))
						{
							if(!used[x, y])
							{
								Node node = new Node { X = x, Y = y };

								neighbors.Add(node);
							}
						}
					}
				}
			}

			return neighbors;
		}
	}

	[DebuggerDisplay("({X},{Y})")]
	class Node : IEquatable<Node>
	{
		public int X { get; set; }
		public int Y { get; set; }

		public override bool Equals(object obj)
		{
			return Equals(obj as Node);
		}

		public bool Equals(Node other)
		{
			if(other == null)
			{
				return false;
			}

			return X == other.X && Y == other.Y;
		}

		public override int GetHashCode()
		{
			return base.GetHashCode();
		}
	}
}