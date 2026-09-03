package com.spplnuiwntb

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { SPPlnApp() }
    }
}

@Composable
fun SPPlnApp() {
    var selected by remember { mutableIntStateOf(0) }
    val items = listOf("Beranda", "Berita", "Agenda", "Profil")
    MaterialTheme {
        Scaffold(
            bottomBar = {
                NavigationBar {
                    items.forEachIndexed { index, label ->
                        NavigationBarItem(selected = selected == index, onClick = { selected = index }, icon = {}, label = { Text(label) })
                    }
                }
            }
        ) { padding ->
            Column(Modifier.fillMaxSize().padding(padding).padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("⚡ SP PLN UIW NTB", style = MaterialTheme.typography.headlineSmall)
                Text("Pusat Informasi & Layanan Serikat Pekerja", style = MaterialTheme.typography.bodyMedium)
                when (selected) {
                    0 -> Dashboard()
                    1 -> SimplePage("Berita & Pengumuman", "Informasi terbaru organisasi akan tampil di sini.")
                    2 -> SimplePage("Agenda Kegiatan", "Jadwal rapat, sosialisasi, dan kegiatan serikat.")
                    3 -> SimplePage("Profil Anggota", "Data profil anggota yang sedang login.")
                }
            }
        }
    }
}

@Composable
fun Dashboard() {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Card(Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp)) { Text("📢"); Text("Berita") } }
        Card(Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp)) { Text("📅"); Text("Agenda") } }
    }
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Card(Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp)) { Text("📚"); Text("Dokumen") } }
        Card(Modifier.weight(1f), shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp)) { Text("⚖️"); Text("Advokasi") } }
    }
    Spacer(Modifier.height(4.dp))
    Text("Informasi Terbaru", style = MaterialTheme.typography.titleLarge)
    Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) { Text("Selamat datang di SP PLN UIW NTB"); Text("Aplikasi V1 sedang dalam tahap pengembangan.") } }
}

@Composable
fun SimplePage(title: String, text: String) {
    Text(title, style = MaterialTheme.typography.headlineSmall)
    Card(Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) { Text(text); Spacer(Modifier.height(12.dp)); Button(onClick = {}) { Text("Muat Data") } } }
}
