using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OAuth1.Models
{
    public class JohnDeereCatalog
    {
        public JohnDeereCatalog()
        {
            Links = new Collection<JohnDeereLink>();
        }

        public IEnumerable<JohnDeereLink> Links { get; private set; }
    }
}