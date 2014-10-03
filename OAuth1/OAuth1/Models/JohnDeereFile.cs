using System;

namespace OAuth1.Models
{
    public sealed class JohnDeereFile : JohnDeereCatalog
    {
        public string ID { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public DateTime? CreatedTime { get; set; }

        public DateTime? ModifiedTime { get; set; }

        public string Source { get; set; }

        public bool TransferPending { get; set; }

        public string VisibleViaShared { get; set; }

        public bool Shared { get; set; }

        public string Status { get; set; }

        public bool Archived { get; set; }

        public bool New { get; set; }
    }
}