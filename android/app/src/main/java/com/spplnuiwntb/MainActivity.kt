package com.spplnuiwntb

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

private const val SERVER_URL = "https://script.google.com/macros/s/AKfycbxzz9H1szCdHnYrlHGyUHzIuY22OKuzx3I9z56anbLHCr5fPJZFX9yypC5KeW68QCBA/exec"

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { SPPlnWebApp() }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun SPPlnWebApp() {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                webViewClient = WebViewClient()
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
                clearCache(false)
                loadUrl("https://anggidwisss-boop.github.io/SP-PLN-UIW-NTB/?server=" + android.net.Uri.encode(SERVER_URL) + "&v=20260904")
            }
        }
    )
}
