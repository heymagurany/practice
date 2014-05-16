using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Katana.Models;

namespace Katana.Controllers
{
    [Authorize]
    public class AppsController : Controller
    {
        [HttpGet]
        public ActionResult Register()
        {
            var model = new AppModel();

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(true)]
        public ActionResult Register(AppModel model)
        {
            model.ClientId = Guid.NewGuid().ToString("N");
            model.ClientSecret = Guid.NewGuid().ToString("N");

            var apps = Session.GetRegisteredApps();
            apps.Add(model);

            Session.SaveRegisteredApps(apps);

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
            var model = Session.GetRegisteredApps().FirstOrDefault(app => StringComparer.OrdinalIgnoreCase.Equals(id, app.ClientId));

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
            var apps = Session.GetRegisteredApps();
            apps.Remove(model);
            
            Session.SaveRegisteredApps(apps);

            return RedirectToAction("index");
        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            var model = Session.GetRegisteredApps().FirstOrDefault(app => StringComparer.OrdinalIgnoreCase.Equals(id, app.ClientId));

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
            var apps = Session.GetRegisteredApps();
            var index = apps.IndexOf(model);

            apps[index] = model;

            Session.SaveRegisteredApps(apps);
            
            return RedirectToAction("index");
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = Session.GetRegisteredApps();

            return View(model);
        }
	}
}