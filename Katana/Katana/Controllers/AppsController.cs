using System;
using System.Linq;
using System.Web.Mvc;
using Katana.Models;

namespace Katana.Controllers
{
    [Authorize]
    public class AppsController : Controller
    {
        private readonly AppManagerService m_AppManager;

        internal AppsController(AppManagerService appManager)
        {
            m_AppManager = appManager;
        }

        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(true)]
        public ActionResult Register(AppModel model)
        {
            model.ClientId = Guid.NewGuid().ToString("N");
            model.ClientSecret = Guid.NewGuid().ToString("N");

            m_AppManager.RegisterApp(model);

            return View("Details", model);
        }

        [HttpGet]
        public ActionResult Details(string id)
        {
            var model = new AppModel();

            return View(model);
        }

        [HttpGet]
        public ActionResult Delete(string id)
        {
            var model = m_AppManager.GetApps().FirstOrDefault(app => StringComparer.OrdinalIgnoreCase.Equals(id, app.ClientId));

            if(model == null)
            {
                return HttpNotFound();
            }

            return View(model);
        }

        [HttpPost]
        [ValidateInput(true)]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(AppModel model)
        {
            m_AppManager.DeleteApp(model.ClientId);

            return RedirectToAction("index");
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            var model = m_AppManager.GetApps().FirstOrDefault(app => StringComparer.OrdinalIgnoreCase.Equals(id, app.ClientId));

            if (model == null)
            {
                return HttpNotFound();
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(true)]
        public ActionResult Edit(AppModel model)
        {
            m_AppManager.EditApp(model);
            
            return RedirectToAction("index");
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = m_AppManager.GetApps();

            return View(model);
        }
	}
}