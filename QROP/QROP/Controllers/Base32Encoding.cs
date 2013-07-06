using System;
using System.Text;

namespace QROP.Controllers
{
	public class Base32Encoding : Encoding
	{
		private const string ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
		private const char PAD_CHAR = '=';

		public override int GetByteCount(char[] chars, int index, int count)
		{
			throw new NotImplementedException();
		}

		public override int GetBytes(char[] chars, int charIndex, int charCount, byte[] bytes, int byteIndex)
		{
			throw new NotImplementedException();
		}

		public override int GetCharCount(byte[] bytes, int index, int count)
		{
			return GetMaxCharCount(count);
		}

		public override int GetChars(byte[] bytes, int byteIndex, int byteCount, char[] chars, int charIndex)
		{
			int charCount = 0;
			int byteEndIndex = byteIndex + byteCount;
			ulong group = 0;

			while(byteIndex < byteEndIndex)
			{
				charCount += 8;

				int count = 0;

				for(int i = 0; i < 5; i++)
				{
					group = group << 8;

					if(byteIndex < byteEndIndex)
					{
						group |= bytes[byteIndex++];
						count++;
					}
				}

				if(count == 1)
				{
					count = 2;
				}
				else if(count == 2)
				{
					count = 4;
				}
				else if(count == 3)
				{
					count = 5;
				}
				else if(count == 4)
				{
					count = 7;
				}
				else 
				{
					count = 8;
				}

				while(count > 0)
				{
					chars[charIndex++] = ALPHABET[(int)(group >> 35) & 31];
					group <<= 5;
					count--;
				}
			}

			while(charIndex < charCount)
			{
				chars[charIndex++] = PAD_CHAR;
			}

			return charCount;
		}

		public override int GetMaxByteCount(int charCount)
		{
			throw new NotImplementedException();
		}

		public override int GetMaxCharCount(int byteCount)
		{
			int charCount = 0;

			for(int i = 0; i < byteCount; i += 5)
			{
				charCount += 8;
			}

			return charCount;
		}
	}
}