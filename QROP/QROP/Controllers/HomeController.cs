using System;
using System.Security.Cryptography;
using System.Text;
using System.Web.Mvc;

namespace QROP.Controllers
{
	public class HomeController : Controller
	{
		private static byte[] m_Secret = new byte[8];
		private static bool s_Initialized;

		[HttpGet]
		public ActionResult Index()
		{
			if(!s_Initialized)
			{
				GenerateSecret();

				s_Initialized = true;
			}

			Uri uri = GetUri(m_Secret);

			DateTime now = DateTime.UtcNow;
			TimeSpan span = now - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
			long time = (long)(span.TotalSeconds / 30);

			ViewBag.Secret = uri.AbsoluteUri;
			ViewBag.Code = GetCode(m_Secret, time);

			return View();
		}

		[HttpPost]
		public ActionResult Index(FormCollection form)
		{
			Encoding encoding = new Base32Encoding();

			ViewBag.Encoded = encoding.GetString(Encoding.UTF8.GetBytes(form["plainText"]));

			return View();
		}

		public ActionResult Generate()
		{
			GenerateSecret();

			Uri uri = GetUri(m_Secret);

			return Json(uri, JsonRequestBehavior.AllowGet);
		}

		private static Uri GetUri(byte[] secret)
		{
			Encoding encoding = new Base32Encoding();

			UriBuilder builder = new UriBuilder();
			builder.Host = "totp";
			builder.Path = "testme";
			builder.Query = "secret=" + encoding.GetString(secret);
			builder.Scheme = "otpauth";

			return builder.Uri;
		}

		private static void GenerateSecret()
		{
			m_Secret = new byte[10];

			using(RNGCryptoServiceProvider random = new RNGCryptoServiceProvider())
			{
				random.GetNonZeroBytes(m_Secret);
			}
		}

		private static int GetCode(byte[] secret, long count)
		{
			byte[] counter = new byte[8];

			for(int i = 7; count > 0; i--)
			{
				counter[i] = (byte)count;
				count >>= 8;
			}

			byte[] hash;

			using(KeyedHashAlgorithm algorithm = new HMACSHA1(secret))
			{
				hash = algorithm.ComputeHash(counter);
			}

			int offset = hash[19] & 0xF;
			int dynamicBinaryCode = ((hash[offset] & 0X7F)) << 24 | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3];
			return dynamicBinaryCode % 1000000;
		}
	}
}