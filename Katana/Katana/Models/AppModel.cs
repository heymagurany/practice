using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Katana.Models
{
    public class AppModel : IComparable, IComparable<AppModel>, IEquatable<AppModel>
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Display(Name = "Client ID")]
        public string ClientId { get; set; }

        [Display(Name = "Client Secret")]
        public string ClientSecret { get; set; }

        [Display(Name = "Redirect URI")]
        [Required]
        [Url]
        public string RedirectUri { get; set; }

        public IEnumerable<string> Scope { get; set; }

        public int CompareTo(object obj)
        {
            return CompareTo(obj as AppModel);
        }

        public int CompareTo(AppModel other)
        {
            if(other == null)
            {
                return 1;
            }

            return StringComparer.OrdinalIgnoreCase.Compare(Name, other.Name);
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as AppModel);
        }

        public bool Equals(AppModel other)
        {
            if(other == null)
            {
                return false;
            }

            return StringComparer.OrdinalIgnoreCase.Equals(ClientId, other.ClientId);
        }

        public override int GetHashCode()
        {
            return ClientId.GetHashCode();
        }
    }
}