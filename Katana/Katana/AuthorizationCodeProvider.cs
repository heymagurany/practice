using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security.Infrastructure;

namespace Katana
{
    internal sealed class AuthorizationCodeProvider : IAuthenticationTokenProvider
    {
        private readonly IDictionary<string, string> m_Codes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        public void Create(AuthenticationTokenCreateContext context)
        {
            var key = GenerateCode();
            var value = context.SerializeTicket();

            context.SetToken(key);

            if(m_Codes.ContainsKey(key))
            {
                m_Codes[key] = value;
            }
            else
            {
                m_Codes.Add(key, value);
            }
        }

        public Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            return Task.Run(() => Create(context));
        }

        private static string GenerateCode()
        {
            return Guid.NewGuid().ToString("N");
        }

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            var key = context.Token;
            string value;

            if(m_Codes.TryGetValue(key, out value))
            {
                m_Codes.Remove(key);
                context.DeserializeTicket(value);
            }
        }

        public Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            return Task.Run(() => Receive(context));
        }
    }
}