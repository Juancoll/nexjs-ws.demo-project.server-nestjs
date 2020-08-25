using nex.ws;

namespace demo.wsclient
{
    public class WSApi<TUser, TToken> : WSApiBase<TUser, TToken>
    {
        #region [ private ]
        private AuthContractWSService<TUser, TToken> _authContract;
        private BaseContractWSService<TUser, TToken> _baseContract;
        private CredentialsContractWSService<TUser, TToken> _credentialsContract;
        #endregion

        #region [ services ]
        public AuthContractWSService<TUser, TToken> authContract { get { return _authContract; } }
        public BaseContractWSService<TUser, TToken> baseContract { get { return _baseContract; } }
        public CredentialsContractWSService<TUser, TToken> credentialsContract { get { return _credentialsContract; } }
        #endregion

        #region [ constructor ]
        public WSApi()
        {
            _authContract = new AuthContractWSService<TUser, TToken>(Rest, Hub);
            _baseContract = new BaseContractWSService<TUser, TToken>(Rest, Hub);
            _credentialsContract = new CredentialsContractWSService<TUser, TToken>(Rest, Hub);
        }
        #endregion
    }
}