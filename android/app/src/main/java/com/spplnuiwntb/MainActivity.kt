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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { SPPlnApp() }
    }
}

@Composable
fun SPPlnApp() {
    var loggedIn by remember { mutableStateOf(false) }
    if (!loggedIn) LoginScreen { loggedIn = true } else MainScreen { loggedIn = false }
}

@Composable
fun LoginScreen(onLogin: () -> Unit) {
    var id by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(
        Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("⚡ SP PLN UIW NTB", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        Text("Aplikasi resmi layanan anggota Serikat Pekerja", style = MaterialTheme.typography.bodyLarge)
        Spacer(Modifier.height(28.dp))
        OutlinedTextField(id, { id = it }, Modifier.fillMaxWidth(), label = { Text("ID Anggota / NIP") }, singleLine = true)
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(password, { password = it }, Modifier.fillMaxWidth(), label = { Text("Password") }, singleLine = true)
        Spacer(Modifier.height(18.dp))
        Button(onClick = onLogin, enabled = id.isNotBlank() && password.isNotBlank(), Modifier.fillMaxWidth()) { Text("MASUK") }
        Spacer(Modifier.height(12.dp))
        Text("Versi 1.0 • UIW NTB", style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun MainScreen(onLogout: () -> Unit) {
    var selected by remember { mutableIntStateOf(0) }
    val items = listOf("Beranda", "Berita", "Agenda", "Profil")
    Scaffold(bottomBar = {
        NavigationBar { items.forEachIndexed { index, label ->
            NavigationBarItem(selected == index, { selected = index }, icon = {}, label = { Text(label) })
        } }
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(20.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("SP PLN UIW NTB", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text("Pusat Informasi & Layanan Serikat Pekerja")
            when (selected) {
                0 -> Dashboard()
                1 -> NewsPage()
                2 -> AgendaPage()
                3 -> ProfilePage(onLogout)
            }
        }
    }
}

@Composable
fun Dashboard() {
    Text("Selamat datang, Anggota 👋", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        FeatureCard("📢", "Berita", Modifier.weight(1f)); FeatureCard("📅", "Agenda", Modifier.weight(1f))
    }
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        FeatureCard("📚", "Dokumen", Modifier.weight(1f)); FeatureCard("⚖️", "Advokasi", Modifier.weight(1f))
    }
    Text("Informasi Terbaru", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
    InfoCard("Selamat datang di SP PLN UIW NTB", "Pusat informasi organisasi, agenda, dokumen dan layanan anggota.")
    InfoCard("Layanan Advokasi", "Gunakan menu advokasi/pengaduan untuk menyampaikan kebutuhan pendampingan.")
}

@Composable
fun FeatureCard(icon: String, title: String, modifier: Modifier) {
    Card(modifier, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors()) { Column(Modifier.padding(16.dp)) { Text(icon, style = MaterialTheme.typography.headlineSmall); Text(title, fontWeight = FontWeight.SemiBold) } }
}

@Composable
fun NewsPage() { Text("Berita & Pengumuman", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); InfoCard("Informasi Organisasi", "Berita dan pengumuman terbaru akan terhubung ke Google Sheets pada tahap backend.") }

@Composable
fun AgendaPage() { Text("Agenda Kegiatan", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); InfoCard("Agenda", "Rapat, sosialisasi, kegiatan organisasi, dan agenda anggota akan tampil di sini.") }

@Composable
fun ProfilePage(onLogout: () -> Unit) {
    Text("Profil Anggota", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
    InfoCard("Data Anggota", "Nama, NIP, unit, jabatan, kontak dan status keanggotaan.")
    OutlinedButton(onClick = onLogout, Modifier.fillMaxWidth()) { Text("KELUAR") }
}

@Composable
fun InfoCard(title: String, body: String) {
    Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) { Text(title, fontWeight = FontWeight.Bold); Text(body) } }
}
