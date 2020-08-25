using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using nex.ws;

namespace demo.wsclient
{
    public class BaseContractWSService<TUser, TToken>: WSServiceBase<TUser, TToken>
    {
        #region [ implement WSServiceBase ]
        public override string Name { get { return "baseContract"; } }
        #endregion

        #region [ constructor ]
        public BaseContractWSService(RestClient<TUser, TToken> rest, HubClient<TUser, TToken> hub)
            :base(rest, hub)
        {
            _onUpdate = new HubNotification<TUser, TToken>(hub, Name, "onUpdate");
            _onDataUpdate = new HubNotificationData<TUser, TToken, DataType>(hub, Name, "onDataUpdate");
        }
        #endregion

        #region [ hub private ]
        private HubNotification<TUser, TToken> _onUpdate { get; }
        private HubNotificationData<TUser, TToken, DataType> _onDataUpdate { get; }
        #endregion

        #region [ hub public ]

        // isAuth: false
        public HubNotification<TUser, TToken> onUpdate { get { return _onUpdate; } }

        // isAuth: false
        public HubNotificationData<TUser, TToken, DataType> onDataUpdate { get { return _onDataUpdate; } }
        #endregion

        #region [ rest ]

        // isAuth: false
        public Task print() { return Request( "print", null, null  ); }

        // isAuth: false
        public Task<double> delay(double value) { return Request<double>( "delay", value, null  ); }

        // isAuth: false
        public Task notify() { return Request( "notify", null, null  ); }
        #endregion
    }
}
