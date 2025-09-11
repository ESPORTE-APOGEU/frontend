import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  return (
    <ScrollView
      className="bg-gray-100 flex-1 px-7 pt-16"
      contentContainerStyle={{ paddingBottom: 70 }}
      >
      <Text className="text-black font-bold text-3xl mb-6">Create Event</Text>
      <TouchableOpacity className="w-full h-28 bg-white bg-opacity-50 border border-gray-400 rounded-lg justify-center items-center mb-6 shadow">
        <Text className="text-gray-500">put the event image here</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nome do Evento"
        placeholderTextColor="#000"
        value={name}
        onChangeText={setName}
        className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg px-4 mb- shadow"
      />

      <TextInput
        placeholder="Localização"
        placeholderTextColor="#000"
        value={location}
        onChangeText={setLocation}
        className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg px-4 mb-0 shadow"
      />

      <View className="mb-0">
        <View className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg overflow-hidden shadow">
          <Picker
            selectedValue={sport}
            onValueChange={setSport}
            className="h-12">
            <Picker.Item label="Esporte" value="" enabled={false} />
            <Picker.Item label="Futebol" value="futebol" />
            <Picker.Item label="Basquete" value="basquete" />
            <Picker.Item label="Vôlei" value="volei" />
          </Picker>
        </View>
      </View>

      <View className="mb-0">
        <View className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg overflow-hidden shadow">
          <Picker
            selectedValue={level}
            onValueChange={setLevel}
            className="h-12">
            <Picker.Item label="Level" value="" enabled={false} />
            <Picker.Item label="Iniciante" value="Iniciante" />
            <Picker.Item label="Intermediario" value="Intermediario" />
            <Picker.Item label="Avançado" value="Avançado" />
            <Picker.Item label="Semi-profissional" value="Semi-profissional" />
          </Picker>
        </View>
      </View>

      <View className="mb-10">
        <View className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg overflow-hidden shadow">
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            className="h-12">
            <Picker.Item label="Genero" value="" enabled={false} />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>
      </View>

      {/*<View className="mb-0">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg px-4 justify-center shadow">
          <TextInput
            editable={false}
            value={date.toLocaleDateString()}
            placeholder="Data do Evento"
            placeholderTextColor="#000"
            className="text-black"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShowDatePicker(Platform.OS === "ios");
              if (d) setDate(d);
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg px-4 justify-center shadow">
          <TextInput
            editable={false}
            value={startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            placeholder="Inicio"
            placeholderTextColor="#000"
            className="text-black"
          />
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(e, d) => {
              setShowStartPicker(Platform.OS === "ios");
              if (d) setStartTime(d);
            }}
          />
        )}
      </View>*/}
      <View className="mb-0">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg flex-row justify-between items-center px-4 mb-0 shadow">
          <Text className="text-black">Data do Evento</Text>
          <Text className="text-black">
            {date.toLocaleDateString("default", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShowDatePicker(Platform.OS === "ios");
              if (d) setDate(d);
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg flex-row justify-between items-center px-4 mb-0 shadow">
          <Text className="text-black">Inicio</Text>
          <Text className="text-black">
            {`${startTime.getHours()} : ${startTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(e, d) => {
              setShowStartPicker(Platform.OS === "ios");
              if (d) setStartTime(d);
            }}
          />
        )}
      </View>
      <View className="mb-6">
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg flex-row justify-between items-center px-4 mb-0 shadow">
          <Text className="text-black">Fim</Text>
          <Text className="text-black">
            {`${endTime.getHours()} : ${endTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(e, d) => {
              setShowEndPicker(Platform.OS === "ios");
              if (d) setEndTime(d);
            }}
          />
        )}

        <View className="w-full h-12 bg-white bg-opacity-50 border-b-2 border-green-700 rounded-lg flex-row justify-between items-center px-4 shadow">
          <Text className="text-black">Valor de entrada</Text>
          <View className="flex-row items-center">
            <TextInput
              value={price}
              onChangeText={(t) => setPrice(t.replace(/\D/g, ""))}
              keyboardType="numeric"
              className="w-16 text-right text-black"
              placeholder="0"
              placeholderTextColor="#000"
              style={{ paddingRight: 0, marginRight: 0 }}
            />
            <Text className="text-black ml-1">$</Text>
          </View>
        </View>
      </View>
      <Text className="text-black font-bold text-2xl mb-1">Descrição</Text>
      <TextInput
        placeholder="Escreva aqui a descrição do seu evento"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        className="w-full h-24 bg-white border border-gray-400 rounded-lg p-4 mb-4 shadow"
      />

      <TouchableOpacity className="w-full h-14 bg-green-600 rounded-full justify-center items-center shadow mb-4">
        <Text className="text-white font-bold text-xl">Criar Evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
