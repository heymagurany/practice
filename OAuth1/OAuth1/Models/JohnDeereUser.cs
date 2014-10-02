namespace OAuth1.Models
{
    public sealed class JohnDeereUser : JohnDeereCatalog
    {
        public string AccountName { get; set; }

        public string GivenName { get; set; }

        public string FamilyName { get; set; }

        public string UserType { get; set; }
    }
}