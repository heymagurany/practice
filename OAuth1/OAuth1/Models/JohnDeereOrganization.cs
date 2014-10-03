using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OAuth1.Models
{
    public sealed class JohnDeereOrganization : JohnDeereCatalog
    {
        public JohnDeereOrganization()
        {
            Addresses = new Collection<object>();
            Partnerships = new Collection<object>();
        }

        public string ID { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public IEnumerable<object> Addresses { get; private set; }

        public IEnumerable<object> Partnerships { get; private set; }

        public bool Member { get; set; }
    }
}