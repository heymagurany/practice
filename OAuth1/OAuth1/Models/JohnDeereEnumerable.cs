using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Newtonsoft.Json;

namespace OAuth1.Models
{
    [JsonObject]
    public sealed class JohnDeereEnumerable<T> : JohnDeereCatalog, IEnumerable<T>
    {
        public JohnDeereEnumerable()
        {
            Values = new Collection<T>();
        }

        public int Total { get; set; }

        public IEnumerable<T> Values { get; private set; }

        public IEnumerator<T> GetEnumerator()
        {
            return Values.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}