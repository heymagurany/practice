using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using OAuth1.Models;

namespace OAuth1.Controllers
{
    public class HomeController : Controller
    {
        private JohnDeereClient JohnDeere
        {
            get
            {
                return new JohnDeereClient(HttpContext, ConfigurationManager.AppSettings["JohnDeereBaseAddress"], ConfigurationManager.AppSettings["JohnDeereConsumerKey"], ConfigurationManager.AppSettings["JohnDeereConsumerSecret"]);
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Connect()
        {
            var callbackBuilder = new UriBuilder(Request.Url);
            callbackBuilder.Path = "/Home/Authorized";

            JohnDeere.RequestAuthentication(callbackBuilder.Uri);

            return View("Index");
        }

        public async Task<ActionResult> Authorized()
        {
            await JohnDeere.VerifyAuthentication();

            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> BroadcastFile(HttpPostedFileBase rxFile)
        {
            await JohnDeere.BroadcastPrescription(rxFile.FileName, rxFile.ContentType, rxFile.InputStream);

            return View("Index");
        }
    }
}