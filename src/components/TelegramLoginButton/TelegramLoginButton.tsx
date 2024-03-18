import React, { useRef, useEffect } from 'react';

export interface TelegramUser {
  id: number
  first_name: string
  username: string
  photo_url: string
  auth_date: number
  hash: string
}

interface Props {
  botName: string
  usePic?: boolean
  className?: string
  cornerRadius?: number
  requestAccess?: boolean
  dataAuthUrl?: string
  dataOnauth?: (user: TelegramUser) => void
  buttonSize?: 'large' | 'medium' | 'small'
  wrapperProps?: React.HTMLProps<HTMLDivElement>
}

// declare global {
//   interface Window {
//     onTelegramAuth: (user: ITelegramUser) => void
//   }
// }

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void
    }
  }
}

const TelegramLoginButton: React.FC<Props> = ({
  wrapperProps,
  dataAuthUrl,
  usePic = false,
  botName,
  className,
  buttonSize = 'large',
  dataOnauth,
  cornerRadius,
  requestAccess = true
}) => {
  const ref = useRef<HTMLDivElement>(null)


  // useEffect(() => {
  //   const button = document.createElement('script')
  //   button.async = true
  //   button.src = 'https://telegram.org/js/telegram-widget.js?22'
  //   button.setAttribute('data-telegram-login', 'name_bot')
  //   button.setAttribute('data-size', 'large')
  //   button.setAttribute('data-radius', '20')
  //   button.setAttribute('data-onauth', 'onTelegramAuth')

  //   document.body.appendChild(button)

  //   window.onTelegramAuth = function (user) {
  //     alert(
  //       'Logged in as ' +
  //         user.first_name +
  //         ' ' +
  //         user.last_name +
  //         ' (' +
  //         user.id +
  //         (user.username ? ', @' + user.username : '') +
  //         ')'
  //     )
  //   }

  //   return () => {
  //     document.body.removeChild(button)
  //   }
  // }, [])

  // return <div id="telegram-widget-container"></div>

  useEffect(() => {
    if (ref.current === null) return

    if (
      typeof dataOnauth === 'undefined' &&
      typeof dataAuthUrl === 'undefined'
    ) {
      throw new Error(
        'One of this props should be defined: dataAuthUrl (redirect URL), dataOnauth (callback fn) should be defined.'
      )
    }

    if (typeof dataOnauth === 'function') {
      window.TelegramLoginWidget = {
        dataOnauth: (user: TelegramUser) => dataOnauth(user)
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', buttonSize)

    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString())
    }

    if (requestAccess) {
      script.setAttribute('data-request-access', 'write')
    }

    script.setAttribute('data-userpic', usePic.toString())

    if (typeof dataAuthUrl === 'string') {
      script.setAttribute('data-auth-url', dataAuthUrl)
    } else {
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)')
    }

    script.async = true

    ref.current.appendChild(script)
  }, [
    botName,
    buttonSize,
    cornerRadius,
    dataOnauth,
    requestAccess,
    usePic,
    ref,
    dataAuthUrl
  ])

  return <div ref={ref} className={className} {...wrapperProps} />
}

export default TelegramLoginButton;
